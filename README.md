## 도커로 어플리케이션 설치 후 시작하기
### 빌드하기
```bash
$docker build -t  mybuild:0.0   ./
```
-t 옵션 : 빌드할 이미지의 이름 지정

build:0.0 : 이미지의 이름과 버전

./ : dockerfile이 위치한 디렉토리

### 빌드된 이미지 확인하기
```bash
$ docker images
```
![image](https://user-images.githubusercontent.com/56494905/169357612-137128c8-94a2-4648-a7b2-36b67efe13de.png)


### 확인된 빌드 고유값으로 실행하기
```bash
$ docker run -it -t 3001:8000 [컨테이너번호]
```

### 테스트용
