# 베이스 이미지로 Node.js 사용
FROM node:20.5.0-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 파일을 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드를 복사
COPY . .

# 애플리케이션 실행
CMD ["npm", "run", "dev"]

# 애플리케이션이 3000 포트를 사용
EXPOSE 3000
