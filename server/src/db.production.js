export class Database {
  constructor(env) {
    this.db = env.AUTH_DB;
  }

  async query(sql, params = []) {
    let stmt = this.db.prepare(sql);
    params.forEach((param, index) => {
      stmt = stmt.bind(`$${index + 1}`, param);
    });
    return await stmt.first();
  }

  async execute(sql, params = []) {
    let stmt = this.db.prepare(sql);
    params.forEach((param, index) => {
      stmt = stmt.bind(`$${index + 1}`, param);
    });
    return await stmt.run();
  }
}
