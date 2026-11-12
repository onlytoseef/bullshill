import * as migration_20261105_094052_initial_cms from './20261105_094052_initial_cms';
import * as migration_20261112_075413_contact_submissions from './20261112_075413_contact_submissions';

export const migrations = [
  {
    up: migration_20261105_094052_initial_cms.up,
    down: migration_20261105_094052_initial_cms.down,
    name: '20261105_094052_initial_cms',
  },
  {
    up: migration_20261112_075413_contact_submissions.up,
    down: migration_20261112_075413_contact_submissions.down,
    name: '20261112_075413_contact_submissions'
  },
];
