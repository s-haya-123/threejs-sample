FROM node:11.7.0-slim
WORKDIR /app
COPY . /app
RUN yarn
CMD yarn serve