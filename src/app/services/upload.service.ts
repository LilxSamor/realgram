import { Injectable } from '@angular/core';
import {PutObjectCommand, S3, S3Client, UploadPartOutputFilterSensitiveLog} from '@aws-sdk/client-s3';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  accessKeyId = ''
  secretAccessKey = ''

  constructor(private http: HttpClient) {}

  s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    },
  });

  async uploadPfp(file: File, username: string) {
    const fileExtension = file.name.split('.').pop()

    const s3 = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });

    const fileArrayBuffer = await file.arrayBuffer();

    await s3.send(
      new PutObjectCommand({
        Bucket: "real.gram",
        Key: 'avatars/' + username + '.' + fileExtension,
        Body: new Uint8Array(fileArrayBuffer)
      })
    );
  }

  async uploadFile(file: File) {
    const s3 = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });

    const fileArrayBuffer = await file.arrayBuffer();

    await s3.send(
      new PutObjectCommand({
        Bucket: "real.gram",
        Key: file.name,
        Body: new Uint8Array(fileArrayBuffer)
      })
    );
  }
}
