FROM node:16 AS base

# Install DEB dependencies and others.
RUN \
    set -x \
    && apt-get update \
    && apt-get install -y net-tools build-essential python3 python3-pip valgrind

WORKDIR /app/packages/server
COPY packages/server/package.json .
COPY packages/server/yarn.lock .
RUN yarn install

FROM node:16 AS clientBuild

WORKDIR /client
COPY packages/client/package.json .
COPY packages/client/yarn.lock .
RUN yarn install
COPY packages/client .
RUN yarn build

FROM base AS final

WORKDIR /app/packages/server
COPY packages/server .

COPY --from=clientBuild /client/build /app/packages/server/client

RUN yarn build

ARG MEDIASOUP_MIN_PORT
ARG MEDIASOUP_MAX_PORT
ENV MEDIASOUP_LISTEN_IP=0.0.0.0

ENV MEDIASOUP_MIN_PORT=${MEDIASOUP_MIN_PORT}
ENV MEDIASOUP_MAX_PORT=${MEDIASOUP_MAX_PORT}

EXPOSE 3000
EXPOSE ${MEDIASOUP_MIN_PORT}-${MEDIASOUP_MAX_PORT}

CMD [ "node", "build/index.js" ]