import { CronJob } from "cron";
import { cronSchedule } from "./config/index.js";
import { File } from "./models/file.js";
import logger from "./utils/log/logger.js";
import { deleteMultipleFiles } from "./utils/aws/index.js";
const deleteFiles = async () => {
  logger.info("Deleting unsafe files");

  try {
    const unsafeFiles = await File.findAll({ where: { safe: false } });
    const filepaths = unsafeFiles.map((file) => ({ Key: file.key }));
    await deleteMultipleFiles(filepaths);
    await File.destroy({ where: { safe: false } });
    logger.info(" Unsafe files Deleted");
  } catch (error) {
    return error;
  }
};

const wakeUpCall = () => {
  logger.info("I'm awake");
};

export const wakeUp = new CronJob(
  cronSchedule,
  function () {
    wakeUpCall();
  },
  () => {
    logger.info("Cron job Done, I'm awake");
  },
  false,
  "Africa/Lagos"
);

export const job = new CronJob(
  cronSchedule,
  async function () {
    try {
      logger.info("Starting Cron Job");

      await deleteFiles();
    } catch (error: any) {
      return error;
    }
  },
  () => {
    logger.info("Cron job Done");
  },
  false,
  "Africa/Lagos"
);
