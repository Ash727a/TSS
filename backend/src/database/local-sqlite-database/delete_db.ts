import { unlink } from 'fs';
// Assuming that 'path/file.txt' is a regular file.
unlink('src/database/local-sqlite-database/suits.sqlite', (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.log('suits.sqlite not found');
      return;
    } else {
      throw err;
    }
  }

  console.log('suits.sqlite was deleted');
});