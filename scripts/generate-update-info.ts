import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

dotenv.config();

interface UpdateInfo {
  version: string;
  notes: string;
  pub_date: string;
  platforms: {
    'windows-x86_64': {
      signature: string;
      url: string;
    };
  };
}

async function generateUpdateInfo() {
  try {
    // Читаем версию из package.json
    const packageJson = JSON.parse(
      readFileSync(join(__dirname, '../package.json'), 'utf-8')
    );
    const version = packageJson.version;

    // Путь к файлу подписи
    const sigPath = join(
      __dirname,
      '../src-tauri/target/release/bundle/nsis',
      `nextry-ui-admin_${version}_x64-setup.exe.sig`
    );

    // Читаем содержимое файла подписи
    const signature = readFileSync(sigPath, 'utf-8');

    // Формируем URL для установщика
    const installerUrl = `https://releases-app.s3.us-east-1.amazonaws.com/admin/windows-x86_64/nextry-ui-admin_${version}_x64-setup.exe`;

    // Создаем объект с информацией об обновлении
    const updateInfo: UpdateInfo = {
      version,
      notes: process.env.RELEASE_NOTES || 'Обновление приложения',
      pub_date: new Date().toISOString(),
      platforms: {
        'windows-x86_64': {
          signature,
          url: installerUrl,
        },
      },
    };

    // Сохраняем локально для проверки
    writeFileSync(
      join(__dirname, '../latest.json'),
      JSON.stringify(updateInfo, null, 2)
    );

    // Загружаем на S3
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    // Загружаем latest.json
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET || 'releases-app',
        Key: 'admin/latest.json',
        Body: JSON.stringify(updateInfo),
        ContentType: 'application/json',
        ACL: 'public-read',
      })
    );

    // Загружаем установщик
    const installerPath = join(
      __dirname,
      '../src-tauri/target/release/bundle/nsis',
      `nextry-ui-admin_${version}_x64-setup.exe`
    );

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET || 'releases-app',
        Key: `admin/windows-x86_64/nextry-ui-admin_${version}_x64-setup.exe`,
        Body: readFileSync(installerPath),
        ContentType: 'application/octet-stream',
        ACL: 'public-read',
      })
    );

    console.log('✅ Update info generated and uploaded successfully!');
  } catch (error) {
    console.error('❌ Error generating update info:', error);
    process.exit(1);
  }
}

generateUpdateInfo(); 