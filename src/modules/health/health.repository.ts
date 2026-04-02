import { checkDatabaseConnection } from "../../shared/database/postgres.js";

export class HealthRepository {
  async checkDatabase() {
    return checkDatabaseConnection();
  }
}
