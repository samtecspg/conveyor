FROM python:2.7.14-alpine

WORKDIR /usr/src/app

RUN pip install requests

RUN apk add dockerize --update-cache --repository http://dl-3.alpinelinux.org/alpine/edge/testing/
COPY . .

VOLUME [ "/usr/src/app" ]

CMD ["dockerize", "-wait", "tcp://elasticsearch:9200", "-wait", "tcp://api:80", "-wait", "tcp://kibana:5601", "-timeout", "5m",  "python", "./install-channels.py"]
