const entitiesDir = process.env.NODE_ENV === 'development' ? 'src' : 'dist';

module.exports = {
   "type": "sqlite",
   "database": "./db/data.sql",
   "synchronize": true,
   "logging": false,
   "dropSchema": true,
   "entities": [
      entitiesDir+"/entity/**/*.{ts,js}",
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}