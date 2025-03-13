import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import {PutObjectCommand, S3, S3Client, UploadPartOutputFilterSensitiveLog} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpBackend } from '@angular/common/http'

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

  getPresignedUrl(filename: string, contentType: string): Observable<{uploadUrl: string}> {
    return this.http.get<{ uploadUrl: string }>("/upload-url", {
      params: { filename, contentType },
    });
  }

  async uploadPfp(file: File, username: string) {
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
        Key: 'avatars/' + username + '.' + file.name,
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
