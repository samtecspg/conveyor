# https://github.com/elastic/kibana-docker
FROM docker.elastic.co/kibana/kibana:5.4.0

# Add your kibana plugins setup here
# Example: RUN kibana-plugin install <name|url>

#Copy my hacked install zip into the kibana container
COPY ./build/conveyor-5.4.0.zip .

#Run the kibana installer to install the plugin
RUN kibana-plugin install file://`pwd`/conveyor-5.4.0.zip
