const SolutionManifest = {
  "S3": {
    "UseAccelerateEndpoint": true,
    "ExpectedBucketOwner": "775588314269"
  },
  "IotHost": "ar3ajum0as5f8-ats.iot.eu-west-1.amazonaws.com",
  "StateMachines": {
    "Ingest": "so0050-0a15d6abc7dd-ingest-main",
    "Analysis": "so0050-0a15d6abc7dd-analysis-main",
    "Main": "so0050-0a15d6abc7dd-main"
  },
  "ApiEndpoint": "https://1jq0vazt79.execute-api.eu-west-1.amazonaws.com/demo",
  "IotTopic": "so0050-0a15d6abc7dd/status",
  "Proxy": {
    "Bucket": "so0050-0a15d6abc7dd-775588314269-eu-west-1-proxy"
  },
  "Ingest": {
    "Bucket": "so0050-0a15d6abc7dd-775588314269-eu-west-1-ingest"
  },
  "SolutionId": "SO0050",
  "Version": "v3.1.2",
  "KnowledgeGraph": {
    "ApiKey": "",
    "Endpoint": ""
  },
  "Region": "eu-west-1",
  "Cognito": {
    "Group": {
      "Viewer": "viewer",
      "Creator": "creator",
      "Admin": "admin"
    },
    "UserPoolId": "eu-west-1_pHihCYm6D",
    "ClientId": "1859go04e008623glalrt03o9f",
    "IdentityPoolId": "eu-west-1:09d4b544-9f8f-45d7-bfc6-1752c44831a2",
    "RedirectUri": "https://d16qad20arnxsa.cloudfront.net"
  },
  "LastUpdated": "2023-05-10T14:20:37.897Z",
  "CustomUserAgent": "AWSSOLUTION/SO0050/v3.1.2",
  "StackName": "so0050-0a15d6abc7dd",
  "AIML": {
    "celeb": true,
    "face": true,
    "facematch": true,
    "label": true,
    "moderation": true,
    "person": true,
    "text": true,
    "segment": true,
    "customlabel": false,
    "minConfidence": 80,
    "customLabelModels": [],
    "frameCaptureMode": 0,
    "textROI": [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false
    ],
    "framebased": false,
    "transcribe": true,
    "keyphrase": true,
    "entity": true,
    "sentiment": true,
    "customentity": false,
    "textract": true
  },
  "ApiOps": {
    "Assets": "assets",
    "Analysis": "analysis",
    "Search": "search",
    "Execution": "execution",
    "AttachPolicy": "attach-policy",
    "FaceCollections": "rekognition/face-collections",
    "FaceCollection": "rekognition/face-collection",
    "Faces": "rekognition/faces",
    "Face": "rekognition/face",
    "CustomLabelModels": "rekognition/custom-label-models",
    "CustomVocabularies": "transcribe/custom-vocabularies",
    "CustomLanguageModels": "transcribe/custom-language-models",
    "CustomEntityRecognizers": "comprehend/custom-entity-recognizers",
    "Stats": "stats",
    "Users": "users",
    "AIOptionsSettings": "settings/aioptions"
  },
  "Statuses": {
    "Processing": "PROCESSING",
    "Completed": "COMPLETED",
    "Error": "ERROR",
    "None": "NONE",
    "NotStarted": "NOT_STARTED",
    "Started": "STARTED",
    "InProgress": "IN_PROGRESS",
    "NoData": "NO_DATA",
    "Removed": "REMOVED",
    "IngestStarted": "INGEST_STARTED",
    "IngestCompleted": "INGEST_COMPLETED",
    "IngestError": "INGEST_ERROR",
    "AnalysisStarted": "ANALYSIS_STARTED",
    "AnalysisCompleted": "ANALYSIS_COMPLETED",
    "AnalysisError": "ANALYSIS_ERROR"
  },
  "FrameCaptureMode": {
    "MODE_NONE": 0,
    "MODE_1FPS": 1,
    "MODE_2FPS": 2,
    "MODE_3FPS": 3,
    "MODE_4FPS": 4,
    "MODE_5FPS": 5,
    "MODE_10FPS": 10,
    "MODE_12FPS": 12,
    "MODE_15FPS": 15,
    "MODE_ALL": 1000,
    "MODE_HALF_FPS": 1001,
    "MODE_1F_EVERY_2S": 1002,
    "MODE_1F_EVERY_5S": 1003,
    "MODE_1F_EVERY_10S": 1004,
    "MODE_1F_EVERY_30S": 1005,
    "MODE_1F_EVERY_1MIN": 1011,
    "MODE_1F_EVERY_2MIN": 1012,
    "MODE_1F_EVERY_5MIN": 1013
  },
  "AnalysisTypes": {
    "Rekognition": {
      "Celeb": "celeb",
      "Face": "face",
      "FaceMatch": "facematch",
      "Label": "label",
      "Moderation": "moderation",
      "Person": "person",
      "Text": "text",
      "Segment": "segment",
      "CustomLabel": "customlabel"
    },
    "Transcribe": "transcribe",
    "Comprehend": {
      "Keyphrase": "keyphrase",
      "Entity": "entity",
      "Sentiment": "sentiment",
      "CustomEntity": "customentity"
    },
    "Textract": "textract"
  }
};

export default SolutionManifest;
