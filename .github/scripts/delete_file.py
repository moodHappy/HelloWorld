import os
import requests
import json
import base64

# 从环境变量获取所需参数
TOKEN = os.environ.get("GITHUB_TOKEN")
REPO_FULL_NAME = os.environ.get("GITHUB_REPOSITORY") # 例如 "moodHappy/HelloWorld"
FILE_PATH_TO_DELETE = os.environ.get("FILE_PATH_TO_DELETE") # 例如 "Notes/your_file.txt"

if not all([TOKEN, REPO_FULL_NAME, FILE_PATH_TO_DELETE]):
    print("错误：缺少必要的环境变量。请设置 GITHUB_TOKEN, GITHUB_REPOSITORY 和 FILE_PATH_TO_DELETE。")
    exit(1)

# 解析仓库拥有者和仓库名
OWNER, REPO = REPO_FULL_NAME.split('/')

# GitHub API URL
API_URL = f"https://api.github.com/repos/{OWNER}/{REPO}/contents/{FILE_PATH_TO_DELETE}"

HEADERS = {
    "Authorization": f"token {TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

def get_file_sha():
    """获取文件的 SHA 值，如果文件不存在则返回 None"""
    try:
        response = requests.get(API_URL, headers=HEADERS)
        response.raise_for_status() # 对 4xx/5xx 错误抛出异常
        return response.json()["sha"]
    except requests.exceptions.RequestException as e:
        if response.status_code == 404:
            print(f"文件 {FILE_PATH_TO_DELETE} 不存在，无需删除。")
            return None
        else:
            print(f"获取文件 SHA 失败：{e}")
            print(f"响应内容：{response.text}")
            exit(1)

def delete_file(sha):
    """根据 SHA 值删除文件"""
    if sha is None:
        print("没有找到文件的 SHA 值，无法执行删除操作。")
        return

    data = {
        "message": f"Delete {FILE_PATH_TO_DELETE} via GitHub Actions",
        "sha": sha
    }

    try:
        response = requests.delete(API_URL, headers=HEADERS, data=json.dumps(data))
        response.raise_for_status()
        print(f"成功删除文件：{FILE_PATH_TO_DELETE}")
    except requests.exceptions.RequestException as e:
        print(f"删除文件失败：{e}")
        print(f"响应内容：{response.text}")
        exit(1)

if __name__ == "__main__":
    print(f"正在尝试删除文件: {FILE_PATH_TO_DELETE}...")
    file_sha = get_file_sha()
    delete_file(file_sha)

