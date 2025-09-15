import subprocess
import webbrowser
import time
import sys
from colorama import init, Fore, Style

init(autoreset=True)

def log_info(msg):
    print(f"{Fore.BLUE}[INFO] {msg}{Style.RESET_ALL} ℹ️")

def log_success(msg):
    print(f"{Fore.GREEN}[OK] {msg}{Style.RESET_ALL} ✅")

def log_error(msg):
    print(f"{Fore.RED}[FAIL] {msg}{Style.RESET_ALL} ❌")

def log_warning(msg):
    print(f"{Fore.YELLOW}[WARN] {msg}{Style.RESET_ALL} ⚠️")

def main():
    try:
        log_info("Instalando dependências do backend...")
        subprocess.run(["npm.cmd", "install"], cwd="api", check=True)
        log_success("Dependências do backend instaladas!")

        log_info("Instalando dependências do frontend...")
        subprocess.run(["npm.cmd", "install"], cwd="frontend", check=True)
        log_success("Dependências do frontend instaladas!")

        log_info("Iniciando o backend...")
        backend = subprocess.Popen(["npm.cmd", "run", "dev"], cwd="api")
        log_success("Backend rodando em http://localhost:3333")

        log_info("Aguardando o backend iniciar...")
        time.sleep(10)

        log_info("Iniciando o frontend...")
        frontend = subprocess.Popen(["npm.cmd", "run", "dev"], cwd="frontend")
        log_success("Frontend rodando em http://localhost:5173")

        log_info("Aguardando o frontend iniciar...")
        time.sleep(10)

        log_info("Abrindo navegador...")
        webbrowser.open("http://localhost:5173")
        log_success("Navegador aberto!")

        backend.wait()
        frontend.wait()

    except subprocess.CalledProcessError as e:
        log_error(f"Erro ao executar comando: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        log_warning("Interrompido pelo usuário. Encerrando processos...")
        try:
            backend.terminate()
            frontend.terminate()
        except Exception:
            pass
        sys.exit(0)

if __name__ == "__main__":
    main()