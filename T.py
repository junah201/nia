import json

# 로그 데이터
with open("log_data.txt", 'r', encoding="utf-8") as f:
    log_data = f.read()

# 로그 데이터를 줄 단위로 분할
lines = log_data.strip().split("\n")

# 첫 번째 줄과 두 번째 줄을 분석
version = lines[0].split(": ")[1]
fields = lines[1].split(": ")[1].split()

all_data = []

# 로그 항목 추출
for line in lines[2:]:
    log_values = line.split()
    log_dict = {fields[i]: log_values[i] for i in range(len(fields))}
    all_data.append(log_dict)

with open("all_log_data.json", 'w', encoding="utf-8") as f:
    json.dump(all_data, f, ensure_ascii=False, indent=4)
