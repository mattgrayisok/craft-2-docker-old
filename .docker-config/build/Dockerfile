FROM node:6.2-wheezy

WORKDIR /project

COPY ./.docker-config/build/package.json package.json

COPY ./.docker-config/build/provision.sh /tmp/provision.sh
RUN chmod +x /tmp/provision.sh
RUN /tmp/provision.sh

COPY ./.docker-config/build/gulpfile.js gulpfile.js

CMD ./node_modules/.bin/gulp build
