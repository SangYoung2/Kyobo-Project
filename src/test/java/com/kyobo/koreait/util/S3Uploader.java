package com.kyobo.koreait.util;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;

import java.io.File;

@Log4j2
@RequiredArgsConstructor
public class S3Uploader {
    private final AmazonS3Client amazonS3Client;
    @Value("${cloud.aws.s3.bucket}")
    public String bucket;

    //S3로 파일 업로드하기
    public String upload(String filePath) throws Exception{
        File targetFile = new File(filePath);
        // S3로 업로드
        String uploadImageUrl = putS3(targetFile, targetFile.getName());
        // 원본 파일 삭제하기
        removeOriginalFile(targetFile);
        // 업로드 된 URL을 리턴한다.
        return uploadImageUrl;
    }

    //S3로 업로드
    private String putS3(File uploadFile, String fileName) throws Exception{
        log.info("===== S3 업로드 시도중.. =====");
        //지정된 bucket의 S3에 해당 파일이름으로 해당 파일을 업로드 한다
        amazonS3Client.putObject(
                new PutObjectRequest(bucket, fileName, uploadFile)
                        .withCannedAcl(CannedAccessControlList.PublicRead)
        );
        log.info("===== S3 업로드 성공! =====");
        return amazonS3Client.getUrl(bucket, fileName).toString();
    }

    //S3로 업로드 후 원본 파일 삭제
    private void removeOriginalFile(File targetFile){
        // 파일이 존재하고, 지웠다면
        if (targetFile.exists() && targetFile.delete()){
            log.info("==== 원본 파일 삭제 성공! ====");
            return;
        }
        log.info("==== 원본 파일 삭제 실패.. ====");
    }

    // S3 서버에 업로드 되어있는 파일 삭제하기
    public void removeS3File(String fileName){
        log.info("=====" + fileName + "=====");
        // S3 버킷명과 파일명을 전달하여 삭제요청을 생성
        DeleteObjectRequest deleteObjectRequest = new DeleteObjectRequest(bucket, fileName);
        // 삭제 요청 전송
        amazonS3Client.deleteObject(deleteObjectRequest);
        log.info(" ===== [ " + fileName + " ] 삭제 성공! ===== ");
    }
}
