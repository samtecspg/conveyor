ARG ELASTIC_TAG=6.3.2
# https://github.com/elastic/kibana-docker
FROM docker.elastic.co/kibana/kibana:${ELASTIC_TAG}
ARG ELASTIC_TAG
ARG CONVEYOR_VERSION=1.4.2
# to understand the "ARG" stuff see:
#   https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact

COPY ./build/conveyor-${CONVEYOR_VERSION}.zip .
#In case your umask doesn't give everyone read rights, and
#until the --chown arg to COPY is more commonly available
# (... see:  https://github.com/moby/moby/issues/6119 & https://github.com/moby/moby/pull/34263
USER root
RUN chmod 444 conveyor-${CONVEYOR_VERSION}.zip
USER kibana

#Run the kibana installer to install the plugin
RUN NODE_OPTIONS="--max-old-space-size=4096" kibana-plugin install file://`pwd`/conveyor-${CONVEYOR_VERSION}.zip
RUN NODE_OPTIONS="--max-old-space-size=4096" kibana-plugin install https://download.elastic.co/kibana/canvas/kibana-canvas-0.1.2085.zip

