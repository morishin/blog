import fs from 'fs/promises';
import OpenAI from 'openai';
import path from 'path';
import readline from 'readline';

const mdRoot = path.join(process.cwd(), 'data', 'posts');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function translateMarkdown(content: string): Promise<string> {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are a professional translator. Translate the following markdown content from Japanese to English. Preserve all markdown formatting, code blocks, and frontmatter (the section between ---). Do not translate the frontmatter section, only translate the content after it. Keep the original structure and formatting intact."
            },
            {
                role: "user",
                content: content
            }
        ],
        temperature: 0.3,
    });

    return response.choices[0].message?.content || '';
}

async function processFile(filePath: string) {
    const content = await fs.readFile(filePath, 'utf-8');
    const translatedContent = await translateMarkdown(content);
    
    const parsedPath = path.parse(filePath);
    const enFilePath = path.join(parsedPath.dir, `${parsedPath.name}/en.md`);
    await fs.mkdir(path.dirname(enFilePath), { recursive: true });
    
    await fs.writeFile(enFilePath, translatedContent);
    console.log(`Translated: ${filePath} -> ${enFilePath}`);
}

async function findMarkdownFiles(dirPath: string): Promise<string[]> {
    const files = await fs.readdir(dirPath);
    const markdownFiles: string[] = [];

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = await fs.stat(filePath);

        if (stat.isDirectory()) {
            if (file.match(/^\d{2}$/)) {
                const subFiles = await findMarkdownFiles(filePath);
                markdownFiles.push(...subFiles);
            }
        } else if (file.endsWith('.md')) {
            markdownFiles.push(filePath);
        }
    }

    return markdownFiles;
}

async function processDirectory(dirPath: string) {
    const files = await findMarkdownFiles(dirPath);
    for (const file of files) {
        await processFile(file);
    }
}

async function processAllEntries() {
    const files = await findMarkdownFiles(mdRoot);
    for (const file of files) {
        await processFile(file);
    }
}

function question(query: string): Promise<boolean> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === 'y');
        });
    });
}

async function main() {
    const [year, month, day] = process.argv.slice(2);
    let targetPath = mdRoot;

    if (year) {
        targetPath = path.join(targetPath, year);
        if (month) {
            targetPath = path.join(targetPath, month);
            if (day) {
                targetPath = path.join(targetPath, day);
            }
        }
    }

    try {
        await fs.access(targetPath);
    } catch {
        console.error(`Error: Directory not found: ${targetPath}`);
        process.exit(1);
    }

    const files = await findMarkdownFiles(targetPath);
    if (files.length === 0) {
        console.log('No markdown files found.');
        process.exit(0);
    }

    console.log('\nTarget files:');
    files.forEach(file => {
        console.log(`- ${file.replace(mdRoot + '/', '')}`);
    });
    console.log(`\nTotal: ${files.length} files`);

    const confirmMessage = year
        ? `\nTranslate all markdown files under ${targetPath}? (Y/n) `
        : '\nTranslate ALL markdown files in the repository? (Y/n) ';

    if (!await question(confirmMessage)) {
        console.log('Aborted.');
        process.exit(0);
    }

    if (year) {
        await processDirectory(targetPath);
    } else {
        await processAllEntries();
    }
}

main().catch(console.error); 