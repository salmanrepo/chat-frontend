FROM node:18 as build
WORKDIR /app
COPY . .
RUN npx create-react-app . && npm run build

FROM node:18
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
