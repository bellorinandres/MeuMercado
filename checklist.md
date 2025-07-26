# 1️⃣ Antes de empezar una nueva funcionalidad
git checkout develop
git pull origin develop
git checkout -b feature/nombre-de-la-feature

# 2️⃣ Trabajar en la rama feature
# … haces tus cambios …
git add .
git commit -m "feat: implementa nombre-de-la-feature"
git push origin feature/nombre-de-la-feature

# 3️⃣ Cuando esté listo para pruebas/desarrollo
git checkout develop
git pull origin develop
git merge feature/nombre-de-la-feature
git push origin develop

# 4️⃣ Cuando todo en develop esté estable y probado
git checkout main
git pull origin main
git merge develop
git push origin main
