ARG ELASTIC_TAG=6.3.0
# https://github.com/elastic/kibana-docker
FROM docker.elastic.co/kibana/kibana:${ELASTIC_TAG}
ARG ELASTIC_TAG
# to understand the "ARG" stuff see:
#   https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact

COPY ./build/conveyor-2.0.0.zip .
#In case your umask doesn't give everyone read rights, and
#until the --chown arg to COPY is more commonly available
# (... see:  https://github.com/moby/moby/issues/6119 & https://github.com/moby/moby/pull/34263
USER root
RUN chmod 444 conveyor-2.0.0.zip
USER kibana

#Run the kibana installer to install the plugin
RUN NODE_OPTIONS="--max-old-space-size=4096" kibana-plugin install file://`pwd`/conveyor-1.4.0.zip
RUN NODE_OPTIONS="--max-old-space-size=4096" kibana-plugin install https://download.elastic.co/kibana/canvas/kibana-canvas-0.1.2002.zip

