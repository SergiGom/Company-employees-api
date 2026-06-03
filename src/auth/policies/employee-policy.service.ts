import {
  Injectable,
} from '@nestjs/common';

@Injectable()
export class EmployeePolicyService {
  canEditEmployee(
    user: any,
    employee: any,
  ) {
    if (
      user.role === 'ADMIN'
    ) {
      return true;
    }

    return (
      user.companiaId ===
      employee.companiaId
    );
  }

  canPatch(
    user: any,
  ) {
    if (
      user.role === 'ADMIN' &&
      user.ciudad === 'MEDELLIN'
    ) {
      return false;
    }

    return true;
  }

  canDelete(
    user: any,
  ) {
    if (
      user.role === 'ADMIN' &&
      user.ciudad === 'BOGOTA'
    ) {
      return false;
    }

    return true;
  }
}