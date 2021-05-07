// import { Password } from './password-debug';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    console.log({ buf });
    console.log(buf.toString('hex'));
    return `${buf.toString('hex')}.${salt}}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    console.log({ storedPassword, suppliedPassword });
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    console.log(' ================================');
    console.log('is same ???');
    console.log({ buf });
    console.log(buf.toString('hex'));
    console.log(hashedPassword);
    console.log(' ================================');

    return buf.toString('hex') === hashedPassword;
  }

  print() {}
}

// const test = async ()=>{
//   console.log('start')
//   const pwd = "12345678"
//   const hashPwd = await Password.toHash(pwd)
//   const res = await Password.compare(hashPwd, pwd)
//   console.log(res)
// }
// console.log('***')
// test()
