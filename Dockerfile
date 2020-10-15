# Magnus Dockerfile
# Use latest/current node version with alpine for small size
FROM node:latest

# Set up some arguments
ARG APP_DIR="/app"
ARG UNPRIV_USER="magnus"

# CD and copy all of our files into our application's directory
WORKDIR "${APP_DIR}"
COPY . .

# Install any necessary dependencies that don't currently exist
#RUN apk add python
RUN apt-get update
RUN apt-get install -y ffmpeg build-essential

# Install our application
RUN npm install

# Create our unprivileged user 
# Uncomment these lines for Alpine
#RUN addgroup -S "${UNPRIV_USER}"
#RUN adduser \
#    -SDH \
#    -g "${UNPRIV_USER}" \
#    -s "/sbin/nologin" \
#    -G "${UNPRIV_USER}" \
#    -h "${APP_DIR}" \
#    "${UNPRIV_USER}"

# Uncomment these lines for Debian-based linux
RUN addgroup --system "${UNPRIV_USER}"
RUN adduser \
    --system \
    --home "${APP_DIR}" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --gecos "${UNPRIV_USER}" \
    --ingroup "${UNPRIV_USER}" \
    --disabled-password \
    --disabled-login \
    "${UNPRIV_USER}"
RUN usermod -a -G "${UNPRIV_USER}" "${UNPRIV_USER}"

# de-escalate privileges to the unprivileged user and make sure the app dir is owned by them
RUN chown -R "${UNPRIV_USER}:${UNPRIV_USER}" "${APP_DIR}"
USER "${UNPRIV_USER}"

# Run our application
CMD [ "npm", "start" ]
# ENTRYPOINT [ "npm" "start" ]