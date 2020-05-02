/**
 * Request objects hold information for a particular source (see sources for example)
 * This allows us to to use a generic api to make the calls against any source
 */

import { SearchRequest } from "../models/SearchRequest"
import { Manga } from "../models/Manga"

export abstract class Source {
  protected cheerio: CheerioAPI
  constructor(cheerio: CheerioAPI) {
    this.cheerio = cheerio
  }

  // Get information about particular manga
  abstract getMangaDetailsRequest(ids: string[]): any
  abstract getMangaDetails(data: any, mangaId: string): Manga

  // Get all chapters related to a manga
  abstract getChapterRequest(mangaId: string): any
  abstract getChapters(data: any, mangaId: string): any

  // Get all pages for a particular chapter
  abstract getChapterDetailsRequest(mangaId: string, chapId: string):any
  abstract getChapterDetails(data: any, metadata: any): any

  // Determines if, and how many times, the passed in ids have been updated since reference time 
  abstract filterUpdatedMangaRequest(ids: any, time: Date, page: number): any
  abstract filterUpdatedManga(data: any, metadata: any): any

  // For the apps home page, there are multiple sections that contain manga of interest
  // Function returns formatted sections and any number of such
  abstract getHomePageSectionRequest(): any
  abstract getHomePageSections(key: any, data: any, sections: any): any
  
  // Does a search request - It is capable of doing advanced searches
  // See SearchRequest interface or MangaPark implementation for more information
  abstract searchRequest(query: SearchRequest, page: number): any
  abstract search(data: any): any

  // Many sites use '[x] time ago' - Figured it would be good to handle these cases in general
  protected convertTime(timeAgo: string): Date {
    let time: Date
    let trimmed: number = Number((/\d*/.exec(timeAgo) ?? [])[0])
    if (timeAgo.includes('minutes')) {
      time = new Date(Date.now() - trimmed * 60000)
    }
    else if (timeAgo.includes('hours')) {
      time = new Date(Date.now() - trimmed * 3600000)
    }
    else if (timeAgo.includes('days')) {
      time = new Date(Date.now() - trimmed * 86400000)
    }
    else {
      time = new Date(Date.now() - 31556952000)
    }

    return time
  }
}