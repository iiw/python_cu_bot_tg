FROM node:20.10

RUN apt-get update
RUN apt-get install -y python3

WORKDIR /app

# Copy the file `package.json` from current folder
# inside our image in the folder `/app`
COPY ./package.json /app/package.json

# Install the dependencies
RUN npm install

# Copy all files from current folder
# inside our image in the folder `/app`
COPY . /app

# Start the app
ENTRYPOINT ["npm", "start"]