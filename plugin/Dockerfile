# https://github.com/elastic/kibana-docker
FROM docker.elastic.co/kibana/kibana:5.6.1

# Add your kibana plugins setup here
# Example: RUN kibana-plugin install <name|url>

#Copy my hacked install zip into the kibana container
COPY ./build/conveyor-5.6.1.zip .
#In case your umask doesn't given everyone read rights, and
#until the --chown arg to COPY is more commonly available
# (... see:  https://github.com/moby/moby/issues/6119 & https://github.com/moby/moby/pull/34263
USER root
RUN chmod 444 conveyor-5.6.1.zip
USER kibana

#Run the kibana installer to install the plugin
RUN kibana-plugin install file://`pwd`/conveyor-5.6.1.zip
