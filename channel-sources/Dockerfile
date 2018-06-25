FROM python:2.7.14-alpine

WORKDIR /usr/src/app

RUN pip install requests

RUN apk add --no-cache openssl

ENV DOCKERIZE_VERSION v0.6.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

COPY . .

VOLUME [ "/usr/src/app" ]

CMD ["dockerize", "-wait", "http://elasticsearch:9200", "-wait", "http://node-red:1880", "-wait", "http://api:4000",  "-wait", "http://kibana:5601", "-timeout", "8m", "-wait-retry-interval", "10s",  "python", "./install-channels.py"]
