export class CompanyEntity {
  constructor(
    public id: number,
    public nombre: string,
    public direccion: string,
    public telefono: string,
    public fechaCreacion: Date,
  ) {}
}