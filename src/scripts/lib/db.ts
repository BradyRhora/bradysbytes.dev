import { PrismaClient, Song } from "@/../generated/prisma"; 
import { shuffle } from "./helpers";

export const prisma = new PrismaClient();

export const MAX_SKIPS = 5;
export const CUTOFF_INCREASE = 1.75; // seconds
const MAX_CLIP_DURATION = MAX_SKIPS * CUTOFF_INCREASE;

// Songs
export async function getAllSongs() {
    const songs = await prisma.song.findMany();
    return songs;
}

export async function getSongByScheduleIndex(index: number) {
	const scheduledSong = await prisma.schedule.findFirst({where: {id: index}, include:{song:true}});
	
	if (!scheduledSong) return null;
	return scheduledSong.song;
}

export async function getTodaysSong() {
    const config = await prisma.paFConfig.findFirst();
	if (!config) return null;

	const lastDay = config.currentDate;
	const today = new Date(Date.now());
	today.setHours(0, 0, 0, 0);
	
	if (!lastDay || lastDay < today) {
		config.currentDate = today;
		config.songIndex++;
		const newSongLength = (await getSongByScheduleIndex(config.songIndex))?.duration || 0;
		//config.todaysStartTime = roundToDecimalPlaces(Math.random() * (newSongLength) - MAX_CLIP_DURATION, 5);
		config.todaysStartTime = Math.random() * (newSongLength - MAX_CLIP_DURATION);
		//console.log(`start time is ${config.todaysStartTime} from duration of ${newSongLength} (${(await getSongByScheduleIndex(config.songIndex))?.duration})`)

		await prisma.paFConfig.update({
			where: { id: config.id },
			data: {
				currentDate: config.currentDate,
				songIndex: config.songIndex,
				todaysStartTime: config.todaysStartTime
			}
		});
	}

	const scheduledSong = await prisma.schedule.findFirst({where: {id: config.songIndex}, include:{song:true}});
	
	if (!scheduledSong) return null;
	return { ...scheduledSong.song, dayIndex: config.songIndex, startTime: config.todaysStartTime};
}

export async function addSong(title: string, artist: string, duration: number, path: string, date?: Date) {
    const song = await prisma.song.create({
        data: {
            title: title,
            artist: artist,
			duration: duration,
			date: date,
            filePath: path
        }
    }) 

    return song;
}

export async function addSongsToSchedule(songs: Song[]) {
	if (!songs || songs.length === 0) return;

	// Get the last scheduled song ID or start from -1
	let lastScheduled = (await prisma.schedule.findFirst({orderBy: {id: "desc"}}))?.id || -1;

	const shuffled = shuffle(songs);
	const schedule = await prisma.schedule.createMany({
		data: shuffled.map((song) => ({
			id: ++lastScheduled,
			songId: song.id
		}))
	});

	return schedule;

}

// Users
export async function getUser(id: string) {
	const user = await prisma.user.findFirst({where: {id: id}});
	return user;
}

export async function getOrCreateUserByName(name: string) {
	let user = await prisma.user.findFirst({where: {name: name}});
	if (!user) {
		user = await prisma.user.create({data: {
			name: name,			
		}})
	}
	return user;
}

// User performance
// Returns new number of user skips for today
export async function addSkip(userID: string) {
	const config = await prisma.paFConfig.findFirst();
	if (!config) return null;

	const todaysPerformance = await prisma.userPerformance.findFirst({
		where: {userId: userID, scheduleIndex: config.songIndex}
	});

	if (!todaysPerformance) {
		await prisma.userPerformance.create({data: {
			userId: userID,
			scheduleIndex: config.songIndex,
			skipsUsed: 1
		}})

		return 1;
	} else {
		todaysPerformance.skipsUsed++;
		if (todaysPerformance.skipsUsed > 5) return 5;

		await prisma.userPerformance.update({
			where: {id: todaysPerformance.id},
			data: {skipsUsed: todaysPerformance.skipsUsed}
		});

		return todaysPerformance.skipsUsed;
	}
}

export async function getSuccess(userID: string) {
	const config = await prisma.paFConfig.findFirst();
	if (!config) return;

	const todaysPerformance = await prisma.userPerformance.findFirst({
		where: {userId: userID, scheduleIndex: config.songIndex}
	});

	if (todaysPerformance) {
		return todaysPerformance.success;
	}
}

export async function succeed(userID: string) {
	const config = await prisma.paFConfig.findFirst();
	if (!config) return;

	const todaysPerformance = await prisma.userPerformance.findFirst({
		where: {userId: userID, scheduleIndex: config.songIndex}
	});

	if (!todaysPerformance) {
		await prisma.userPerformance.create({data: {
			userId: userID,
			scheduleIndex: config.songIndex,
			skipsUsed: 0,
			success: true
		}})
	} else {
		await prisma.userPerformance.update({
			where: {id: todaysPerformance.id},
			data: {success: true}
		});
	}
}

export async function getSkips(userID: string) {
	const config = await prisma.paFConfig.findFirst();
	if (!config) return null;

	const todaysPerformance = await prisma.userPerformance.findFirst({
		where: {userId: userID, scheduleIndex: config.songIndex}
	});

	if (!todaysPerformance) return 0;

	return todaysPerformance.skipsUsed;
}

/*
async function main() {}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
*/