import { ValidationError } from 'class-validator';
import { getPropertyObj } from './utils/utility-types';

const listaObj = {
  whitelistValidation: 'Este atributo no es permitido',
  isUppercase: 'Tiene que estar escrito en mayúscula',
  isNotEmpty: 'No puede ser vacío',
  isEmail: 'El formato (email) no corresponde',
  isLowercase: 'Tiene que estar escrito en minúscula',
  isLength: 'La longitud debe ser $1 o igual a $2 caracteres',
  isStrongPassword: 'La contraseña no es lo suficientemente fuerte',
  isAlpha: 'Debe contener solamente letras (a-zA-Z)',
};

const listaErrores: Record<string, string> = listaObj;

interface IMisErroresDTO {
  property: string;
  valueProperty: string;
  constrain: string;
}

function erroresParam(str: string, errKey: string, errVal: string): string {
  if (str) {
    if (errKey === getPropertyObj(listaObj, 'isLength')) {
      if (errVal.split(String.fromCharCode(32))[3] === 'longer') {
        str = str.replace('$1', 'mayor');
      } else {
        str = str.replace('$1', 'menor');
      }
      str = str.replace('$2', errVal.split(String.fromCharCode(32))[8]);
      return str;
    } else {
      return str;
    }
  } else {
    return `*${errKey}*${errVal}`;
  }
}

export function traductorValidationError(
  valError: ValidationError[]
): IMisErroresDTO[] {
  let misErrores: IMisErroresDTO[] = [];
  valError.forEach((err) => {
    if (err.constraints) {
      for (const key in err.constraints) {
        misErrores.push({
          property: `${err.property}`,
          valueProperty: `${err.value ? err.value : ''}`,
          constrain: `${err.property}: ${erroresParam(
            listaErrores[key],
            key,
            err.constraints[key]
          )}`,
        });
      }
    }
  });
  return misErrores;
}
