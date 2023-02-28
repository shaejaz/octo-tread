import { parse } from 'yaml'
import { get } from 'https'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { Languages as SavedLanguageFormat } from '@octotread/models/language'

const languagesUrl =
  'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml'
const popularUrl =
  'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/popular.yml'

enum LanguageType {
  Data = 'data',
  Markup = 'markup',
  Programming = 'programming',
  Prose = 'prose',
}

interface Language {
  type: LanguageType
  color?: string
  extensions?: string[]
  tm_scope: string
  ace_mode: string
  language_id: number
  aliases?: string[]
  codemirror_mode?: string
  codemirror_mime_type?: string
  interpreters?: string[]
  group?: string
  filenames?: string[]
  wrap?: boolean
  fs_name?: string
  searchable?: boolean
}

interface LanguageFormat {
  [key: string]: Language
}

const outputDir = 'resources/languages'

async function fetchLanguages(): Promise<LanguageFormat> {
  return new Promise((resolve, reject) => {
    get(languagesUrl, (res) => {
      let rawYaml = ''

      res.on('data', (chunk) => {
        rawYaml += chunk
      })
      res.on('end', () => {
        try {
          resolve(parse(rawYaml))
        } catch (err) {
          reject(err)
        }
      })
    }).on('error', (err) => {
      reject(err)
    })
  })
}

async function fetchPopular(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    get(popularUrl, (res) => {
      let rawYaml = ''

      res.on('data', (chunk) => {
        rawYaml += chunk
      })
      res.on('end', () => {
        try {
          resolve(parse(rawYaml))
        } catch (err) {
          reject(err)
        }
      })
    }).on('error', (err) => {
      reject(err)
    })
  })
}

function getLanguagesByNames(languages: LanguageFormat, names: string[]): LanguageFormat {
  const result: LanguageFormat = {}

  for (const i in languages) {
    const item = languages[i]
    if (names.includes(i)) {
      result[i] = item
    }
  }

  return result
}

function convertToSaveFormat(languages: LanguageFormat): SavedLanguageFormat {
  const result: SavedLanguageFormat = {}

  for (const i in languages) {
    const { color } = languages[i]
    result[i] = { color, slug: i.toLowerCase().replaceAll(' ', '-') }
  }

  return result
}

function writeToJsonFile(object: SavedLanguageFormat, directory: string, filename: string) {
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true })
  }

  writeFileSync(join(directory, filename), JSON.stringify(object))
}

async function main() {
  try {
    const allLanguages = await fetchLanguages()
    const popular = getLanguagesByNames(allLanguages, await fetchPopular())

    writeToJsonFile(convertToSaveFormat(popular), outputDir, 'popular.json')
    writeToJsonFile(convertToSaveFormat(allLanguages), outputDir, 'all.json')
  } catch (err) {
    console.error(err)
  }
}

main()
