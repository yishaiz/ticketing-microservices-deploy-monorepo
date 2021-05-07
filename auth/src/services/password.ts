// import { Password } from './password-debug';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash_orig(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString('hex')}.${salt}}`;
  }

  static async compare_orig(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    return buf.toString('hex') === hashedPassword;
  }

  static async toHash(password: string) {
    // temporary solution for encrpyt, due to errors
    return new Promise((resolve, reject) => {
      const fakeSalt = `${password}.fakesalt`;
      resolve(fakeSalt);
    });

    const salt = randomBytes(8).toString('hex');
    return new Promise((resolve, reject) => {
      scrypt(password, salt, 64, (err, hash) => {
        resolve(`${hash.toString('hex')}.${salt}`);
      });
    });
  }

  // scrypt(password, salt, 64, (err, hash) => {
  //   let result: string;
  //   if (hash) {
  //     result = `${hash.toString('hex')}.${salt}`;
  //   } else {
  //     result = 'there is a problem to create hash';
  //   }

  //   // resolve(`${hash.toString('hex')}.${salt}`);
  //   resolve(result);>

  static async compare(storedPassword: string, suppliedPassword: string) {
    // console.log("compare pwd")
    return new Promise((resolve, reject) => {
      const [hashedPassword, salt] = storedPassword.split('.');
      // const hashedSupplyPassword = thitoHash( suppliedPassword)
      resolve(hashedPassword == suppliedPassword);

      // scrypt(suppliedPassword, salt, 64, (err, hash) => {
      //   if (err) reject(err);
      //   console.log("compare pwd", storedPassword, salt,`${hash.toString('hex')}.${salt}`)
      //   resolve(storedPassword == `${hash.toString('hex')}.${salt}`);
      // });
    });
  }
  print() {}
}
