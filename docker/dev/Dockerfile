# config 
ARG IDIR
# development|production
ARG BMODE=development

# 01a - base image
FROM ebruni/pnpm AS base
ARG IDIR
ENV PATH="/ws/${IDIR}/node_modules/.bin:$PATH"


# 02a - Install dependencies only when package.json changes
FROM base AS deps
ARG IDIR
ARG BMODE
ENV NODE_ENV=${BMODE}
WORKDIR /ws/${IDIR}
# Install dependencies based on the preferred package manager
COPY --chown=node:node package.json .npmrc* pnpm-lock.yaml* ./
RUN --mount=type=cache,id=%%app%%_pnpm-store,uid=1000,gid=1000,target=/home/node/pnpm/store [ -e pnpm-lock.yaml ] && pnpm install --frozen-lockfile || pnpm install

# 03a - Rebuild the source code only when needed
FROM base AS builder
ARG IDIR
WORKDIR /ws/${IDIR}
COPY * .
COPY --from=deps ws/${IDIR}/node_modules ./node_modules
#RUN pnpm run build

# 04a - Production image, copy all the files and run next
FROM base AS runner
ARG IDIR
ARG BMODE
ENV NODE_ENV=
WORKDIR /ws/${IDIR}

LABEL org.opencontainers.image.authors="Bruni Emiliano <info@ebruni.it>"
LABEL org.opencontainers.image.version=1.0

COPY --from=builder ws/${IDIR}/. .
COPY --from=builder ws/${IDIR}/node_modules ./node_modules
COPY --from=builder ws/${IDIR}/package.json ws/${IDIR}/pnpm-lock.yaml* ./

CMD [""]
