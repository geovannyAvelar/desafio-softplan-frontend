FROM node:12.18.3-alpine as builder

COPY . /frontend
WORKDIR /frontend
RUN npm install
RUN npm install -g @angular/cli
RUN ng build --configuration=homologacao

FROM nginx:1.15.8-alpine
COPY --from=builder /frontend/dist/cadastro-pessoas-front/ /usr/share/nginx/html
