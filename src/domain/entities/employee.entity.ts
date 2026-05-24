export class EmployeeEntity {
  constructor(
    public id: number,
    public nombre: string,
    public apellido: string,
    public correo: string,
    public cargo: string,
    public salario: number,
    public companiaId: number,
  ) {}
}