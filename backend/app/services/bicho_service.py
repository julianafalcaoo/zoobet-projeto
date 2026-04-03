import random

bichos = {
    1: {"nome": "Avestruz", "numeros": [1, 2, 3, 4]},
    2: {"nome": "Águia", "numeros": [5, 6, 7, 8]},
    3: {"nome": "Burro", "numeros": [9, 10, 11, 12]},
    4: {"nome": "Borboleta", "numeros": [13, 14, 15, 16]},
    5: {"nome": "Cachorro", "numeros": [17, 18, 19, 20]},
    6: {"nome": "Cabra", "numeros": [21, 22, 23, 24]},
    7: {"nome": "Carneiro", "numeros": [25, 26, 27, 28]},
    8: {"nome": "Camelo", "numeros": [29, 30, 31, 32]},
    9: {"nome": "Cobra", "numeros": [33, 34, 35, 36]},
    10: {"nome": "Coelho", "numeros": [37, 38, 39, 40]},
    11: {"nome": "Cavalo", "numeros": [41, 42, 43, 44]},
    12: {"nome": "Elefante", "numeros": [45, 46, 47, 48]},
    13: {"nome": "Galo", "numeros": [49, 50, 51, 52]},
    14: {"nome": "Gato", "numeros": [53, 54, 55, 56]},
    15: {"nome": "Jacaré", "numeros": [57, 58, 59, 60]},
    16: {"nome": "Leão", "numeros": [61, 62, 63, 64]},
    17: {"nome": "Macaco", "numeros": [65, 66, 67, 68]},
    18: {"nome": "Porco", "numeros": [69, 70, 71, 72]},
    19: {"nome": "Pavão", "numeros": [73, 74, 75, 76]},
    20: {"nome": "Peru", "numeros": [77, 78, 79, 80]},
    21: {"nome": "Touro", "numeros": [81, 82, 83, 84]},
    22: {"nome": "Tigre", "numeros": [85, 86, 87, 88]},
    23: {"nome": "Urso", "numeros": [89, 90, 91, 92]},
    24: {"nome": "Veado", "numeros": [93, 94, 95, 96]},
    25: {"nome": "Vaca", "numeros": [97, 98, 99, 0]},
}

def listar_bichos():
    return[{
        "id": grupo,
            "grupo": grupo,
            "nome": dados["nome"],
            "numeros": dados["numeros"],
    }
    for grupo, dados in bichos.items()]

def descobrir_grupo(milhar: int):
    final = milhar % 100

    for grupo, dados in bichos.items():
        if final in dados["numeros"]:
            return {
                "grupo": grupo,
                "bicho": dados["nome"],
                "final": final
            }

    return None


def sortear_milhar():
    return random.randint(0, 9999)