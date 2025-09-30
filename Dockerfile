# Usar la imagen oficial de Bun
FROM oven/bun:1 AS base

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json bun.lockb* ./

# Instalar dependencias
RUN bun install --frozen-lockfile

# Copiar el código fuente
COPY . .

# Crear usuario no-root para seguridad (compatible con la imagen de Bun)
RUN groupadd --gid 1001 bunjs && \
    useradd --uid 1001 --gid bunjs --shell /bin/sh --create-home bunapp

# Cambiar la propiedad de los archivos
RUN chown -R bunapp:bunjs /app

# Cambiar al usuario no-root
USER bunapp

# Exponer el puerto
EXPOSE 3000

# Healthcheck optimizado para Bun
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun -e "const res = await fetch('http://localhost:3000/'); process.exit(res.ok ? 0 : 1)"

# Comando para ejecutar la aplicación con Bun
CMD ["bun", "run", "index.ts"]