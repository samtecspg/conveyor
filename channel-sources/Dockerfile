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

CMD ["dockerize", "-wait", "tcp://elasticsearch:9200", "-wait", "tcp://kibana:5601", "-wait", "tcp://api:4000", "-timeout", "5m",  "python", "./install-channels.py"]
