FROM node:12
 
WORKDIR /workspaces

COPY . /workspaces

RUN npm rebuild node-sass

RUN yarn install --frozen-lockfile --no-cache

RUN yarn build

ENV TIMEZONE Africa/Narobi

EXPOSE 4720

#RUN yarn server:prod

CMD [ "yarn", "server:prod" ]
