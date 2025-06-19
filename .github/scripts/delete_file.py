import os
import requests
import json
import time # 新增：用于获取当前时间戳

# 从环境变量获取所需参数
TOKEN = os.environ.get("GITHUB_TOKEN")
REPO_FULL_NAME = os.environ.get("GITHUB_REPOSITORY") # 例如 "moodHappy/HelloWorld"
DELETE_QUEUE_PATH = "Notes/delete_queue.json" # 和前端保持一致

if not all([TOKEN, REPO_FULL_NAME]):
    print("错误：缺少必要的环境变量。请设置 GITHUB_TOKEN 和 GITHUB_REPOSITORY。")
    exit(1)

# 解析仓库拥有者和仓库名
OWNER, REPO = REPO_FULL_NAME.split('/')

HEADERS = {
    "Authorization": f"token {TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

def get_github_content(file_path):
    """获取指定文件的内容和 SHA 值"""
    url = f"https://api.github.com/repos/{OWNER}/{REPO}/contents/{file_path}"
    try:
        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()
        data = response.json()
        # GitHub API 返回的内容是 base64 编码的
        content = base64.b64decode(data['content']).decode('utf-8')
        return content, data['sha']
    except requests.exceptions.RequestException as e:
        if response.status_code == 404:
            return None, None # 文件不存在
        else:
            print(f"获取 {file_path} 失败：{e}")
            print(f"响应内容：{response.text}")
            raise

def update_github_content(file_path, content, sha):
    """更新 GitHub 仓库中的文件内容"""
    url = f"https://api.github.com/repos/{OWNER}/{REPO}/contents/{file_path}"
    base64_content = base64.b64encode(content.encode('utf-8')).decode('utf-8')

    payload = {
        "message": f"Update {file_path} via GitHub Actions",
        "content": base64_content,
        "sha": sha
    }
    if sha is None: # 如果文件不存在，就不带 SHA，表示创建
        del payload['sha']
        payload['message'] = f"Create {file_path} via GitHub Actions"


    try:
        response = requests.put(url, headers=HEADERS, data=json.dumps(payload))
        response.raise_for_status()
        print(f"成功更新文件：{file_path}")
        return response.json()['content']['sha'] # 返回新的 SHA
    except requests.exceptions.RequestException as e:
        print(f"更新 {file_path} 失败：{e}")
        print(f"响应内容：{response.text}")
        raise

def delete_github_file(file_path, sha):
    """根据 SHA 值删除 GitHub 仓库中的文件"""
    url = f"https://api.github.com/repos/{OWNER}/{REPO}/contents/{file_path}"
    if sha is None:
        print(f"文件 {file_path} 已不存在或 SHA 未知，跳过删除。")
        return True # 认为删除成功或无需删除

    data = {
        "message": f"Auto-delete {file_path} via GitHub Actions",
        "sha": sha
    }

    try:
        response = requests.delete(url, headers=HEADERS, data=json.dumps(data))
        response.raise_for_status()
        print(f"成功删除文件：{file_path}")
        return True
    except requests.exceptions.RequestException as e:
        if response.status_code == 404:
            print(f"文件 {file_path} 不存在，无需删除。")
            return True # 文件已不存在，视为删除成功
        else:
            print(f"删除文件 {file_path} 失败：{e}")
            print(f"响应内容：{response.text}")
            return False

def process_delete_queue():
    """处理删除队列中的文件"""
    print(f"正在获取删除队列：{DELETE_QUEUE_PATH}...")
    queue_content, queue_sha = get_github_content(DELETE_QUEUE_PATH)

    if queue_content is None:
        print("删除队列文件不存在或为空，无需处理。")
        return

    try:
        delete_queue = json.loads(queue_content)
    except json.JSONDecodeError:
        print("删除队列文件内容无效，不是一个有效的 JSON。")
        return

    current_timestamp = int(time.time() * 1000) # 获取当前毫秒时间戳
    files_to_keep = []
    has_deleted = False

    for item in delete_queue:
        file_path = item.get('path')
        delete_at = item.get('delete_at')
        file_sha = item.get('sha') # 尝试使用队列中记录的 SHA

        if not file_path or not delete_at:
            print(f"队列项格式不正确，跳过：{item}")
            continue

        if current_timestamp >= delete_at:
            print(f"文件 {file_path} 已到期，正在尝试删除...")
            # 重新获取 SHA 以防队列中记录的 SHA 过时
            actual_file_content, actual_file_sha = get_github_content(file_path)
            
            # 如果文件确实存在，使用最新的 SHA 删除
            if actual_file_content is not None:
                if delete_github_file(file_path, actual_file_sha):
                    has_deleted = True
                else:
                    files_to_keep.append(item) # 删除失败，保留在队列中以便下次尝试
            else:
                # 文件实际不存在，直接从队列中移除
                print(f"文件 {file_path} 在仓库中已不存在，从队列中移除。")
                has_deleted = True # 视为处理完成
        else:
            files_to_keep.append(item) # 未到期，保留在队列中

    # 如果有文件被删除或移除，则更新删除队列
    if has_deleted:
        print(f"更新删除队列：保留 {len(files_to_keep)} 项。")
        try:
            new_queue_content = json.dumps(files_to_keep, indent=2)
            update_github_content(DELETE_QUEUE_PATH, new_queue_content, queue_sha)
        except Exception as e:
            print(f"更新删除队列失败：{e}")
            exit(1)
    else:
        print("没有文件到期或需要删除，删除队列未更改。")

if __name__ == "__main__":
    process_delete_queue()
