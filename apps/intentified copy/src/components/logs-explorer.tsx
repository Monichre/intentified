import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

const LogEnum = {
  LOG: 'LOG',
  INFO: 'INFO',
  ERROR: 'ERROR',
};

function formatTimestamp(date: Date) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${day} ${month} ${hours}:${minutes}:${seconds}`;
}

export interface LogsExplorerProps {
  logs: {
    LOG: string[];
    INFO: string[];
    ERROR: string[];
  };
}

export const LogsExplorer = (props: LogsExplorerProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { logs = {} } = props;

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const generateLogEntry = useCallback((timeOffset?: number) => {
    const timestamp = new Date();
    timestamp.setSeconds(timestamp.getSeconds() - (timeOffset ?? 0));

    const randomValue = Math.random();
    const logLevel =
      randomValue > 0.9
        ? LogEnum.ERROR
        : randomValue > 0.45
        ? LogEnum.INFO
        : LogEnum.LOG;

    //@ts-ignore
    const messages = logs?.[logLevel];
    const randomIndex = Math.round(Math.random() * (messages?.length - 1));

    return {
      id: crypto.randomUUID(),
      timestamp: timestamp,
      status: logLevel,
      message: messages?.[randomIndex],
    };
  }, []);

  const initialLogs = [
    generateLogEntry(),
    generateLogEntry(1000),
    generateLogEntry(2000),
    generateLogEntry(3000),
    generateLogEntry(4000),
    generateLogEntry(5000),
    generateLogEntry(6000),
    generateLogEntry(7000),
    generateLogEntry(8000),
    generateLogEntry(9000),
  ];

  const [logEntries, setLogEntries] = useState(initialLogs);

  useEffect(() => {
    const id = setInterval(() => {
      const shouldAddLog = Math.random() > 0.6;

      if (shouldAddLog) {
        setLogEntries(prevLogs => [generateLogEntry(), ...prevLogs]);
      }
    }, 750);

    return () => {
      clearInterval(id);
    };
  }, []);

  const resolveLogColor = {
    LOG: '#a3e635', // Lime green (brand yellow/green)
    INFO: '#3b82f6', // Blue
    ERROR: '#ef4444', // Red
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden h-[400px] bg-black rounded-lg">
      <div className="absolute h-[100px] z-10 left-0 bottom-0 right-0 w-full bg-gradient-to-t from-black to-transparent" />
      <div className="absolute inset-0 w-full">
        <motion.div
          transition={{
            delay: -0.2,
            duration: 0.1,
            staggerChildren: 0.1,
          }}
          layout
          className="flex flex-col w-full relative"
        >
          {logEntries.map((log, index) => (
            <motion.div
              key={log.id}
              layout={true}
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.2 + 0.03 * index,
                  duration: 0.15,
                },
              }}
              className="flex items-center gap-4 py-2 text-xs text-white font-mono border-b border-gray-800"
            >
              <div className="flex-shrink-0 text-gray-400">{formatTimestamp(log.timestamp)}</div>
              <div
                className="flex gap-1 w-[50px] flex-shrink-0 font-bold"
                style={{
                  //@ts-ignore
                  color: resolveLogColor[log.status],
                }}
              >
                [{log.status}]
              </div>
              <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                {log.message}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};


