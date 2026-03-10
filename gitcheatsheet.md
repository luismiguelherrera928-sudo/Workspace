# Git Cheat Sheet

## Configuración Inicial

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
git config --list  # Ver configuración actual
```

## Crear y Clonar Repositorios

```bash
git init                          # Inicializar un nuevo repositorio
git clone <url>                   # Clonar un repositorio existente
git clone <url> <directorio>      # Clonar en un directorio específico
```

## Estado y Cambios

```bash
git status                        # Ver estado del repositorio
git diff                          # Ver cambios no preparados
git diff --staged                 # Ver cambios preparados
git log                           # Ver historial de commits
git log --oneline                 # Ver commits en una línea
git log -n <número>               # Ver los últimos n commits
```

## Preparar y Confirmar

```bash
git add <archivo>                 # Preparar un archivo
git add .                         # Preparar todos los cambios
git commit -m "mensaje"           # Confirmar con mensaje
git commit -am "mensaje"          # Preparar y confirmar archivos modificados
git commit --amend                # Modificar el último commit
```

## Ramas (Branches)

```bash
git branch                        # Listar ramas locales
git branch -a                     # Listar todas las ramas
git branch <nombre>               # Crear una nueva rama
git checkout <rama>               # Cambiar a una rama
git checkout -b <rama>            # Crear y cambiar a una nueva rama
git branch -d <rama>              # Eliminar una rama
git branch -D <rama>              # Forzar eliminación de rama
```

## Fusionar

```bash
git merge <rama>                  # Fusionar una rama en la actual
git merge --no-ff <rama>          # Fusionar creando un commit de merge
```

## Repositorio Remoto

```bash
git remote -v                     # Listar repositorios remotos
git remote add <nombre> <url>     # Agregar un repositorio remoto
git push <remoto> <rama>          # Enviar commits al remoto
git push -u <remoto> <rama>       # Enviar y configurar seguimiento
git pull <remoto> <rama>          # Obtener y fusionar cambios
git fetch <remoto>                # Obtener cambios sin fusionar
```

## Deshacer Cambios

```bash
git restore <archivo>             # Descartar cambios en un archivo
git restore --staged <archivo>    # Despreparar un archivo
git revert <commit>               # Crear un nuevo commit que deshace un commit
git reset --soft HEAD~1           # Deshacer último commit (mantener cambios)
git reset --mixed HEAD~1          # Deshacer último commit (preparados no)
git reset --hard HEAD~1           # Deshacer último commit (eliminar cambios)
```

## Tags

```bash
git tag <nombre>                  # Crear un tag
git tag -a <nombre> -m "mensaje"  # Crear un tag anotado
git tag -l                        # Listar tags
git push origin <tag>             # Enviar un tag
git push origin --tags            # Enviar todos los tags
```

## Stash (Guardar Cambios Temporales)

```bash
git stash                         # Guardar cambios temporalmente
git stash list                    # Listar cambios guardados
git stash pop                     # Recuperar últimos cambios guardados
git stash apply <nombre>          # Aplicar un stash específico
git stash drop <nombre>           # Eliminar un stash
```

## Búsqueda y Historial

```bash
git blame <archivo>               # Ver quién modificó cada línea
git grep "<búsqueda>"             # Buscar en archivos versionados
git log -S "<búsqueda>"           # Buscar commits por contenido
git log --grep="<patrón>"         # Buscar commits por mensaje
```

## Rebase

```bash
git rebase <rama>                 # Cambiar base de la rama actual
git rebase -i HEAD~n              # Rebase interactivo de los últimos n commits
git rebase --continue             # Continuar rebase después de resolver conflictos
git rebase --abort                # Cancelar un rebase
``