# Lambda
- Enkelt å komme i gang
- Node, Python, Java etc
- Kan inline kode for interpreted språk
- Må laste opp zip/jar for kompilerte, eller hvis man trenger feks npm avhengigheter. Kan zippe alt inkludert node_modules/
- Bør deploye fra `aws` cli
- Man må peke lamdaen til funksjonen som skal kalles `<fil>.<exported-funksjon>`, feks `lambda-ocr.handler`
- node 0.10? fra 2013!?

# Google ocr
- ocr kjøring ved opplasting til google drive
- funker OK
- mikk å få satt opp, gjort på en kveld

# S3
- kan brukes som statisk webserver
- enkelt å styre tilganger med policies
- lurt å bruke `aws` cli for å jobbe med

# S3 + Lambda
- Kjempelett å trigge lambda basert på events fra s3, feks `PUT` når en fil lastes opp
- Får event inn som første parameter i lambdaen med info om bucket og key så man enkelt kan hente filen fra bucketen selv

# Roles & Policies
- Fingranulert rettighetsstyring
- Tricky å få riktig
- Enklere når man har gjort det noen ganger (doh!)
- Lag heller roller først under IAM (identity and access management dashboardet), før man lager lambda. Mye enklere enn å gjøre det som del av det å lage ny lambda.
- Vanskelig å finne eksempler på hvilke attributter som kan settes
- MYE dokumentasjon og MYE brødtekst, vanskelig å finne det man leter etter

# ES
- Åpen url for hele verden?
- Andre ting på aws kan launches inn i et VPC (virtual private cloud) der man kan styre tilganger selv
- Virker litt umodent sammenlignet med mange andre services på AWS?
- Kan styre tilgang med IAM roller eller IP adresser
- Alle requests må signeres når man bruker IAM roller for tilgangsstyring!
- Automatisk signering med aws sdk når man bare skal gjøre http direkte
- Herk å måtte signe alle requests?

# Mapping template to get params into lambda:

```
#set($keys = [])
#foreach($key in $input.params().querystring.keySet())
  #set($success = $keys.add($key))
#end

#foreach($key in $input.params().headers.keySet())
  #if(!$keys.contains($key))
    #set($success = $keys.add($key))
  #end
#end

#foreach($key in $input.params().path.keySet())
  #if(!$keys.contains($key))
    #set($success = $keys.add($key))
  #end
#end

{
#foreach($key in $keys)
  "$key": "$util.escapeJavaScript($input.params($key))"#if($foreach.hasNext),#end
#end
,
    "stage": "$context.stage",
    "request-id": "$context.requestId",
    "api-id": "$context.apiId",
    "resource-path": "$context.resourcePath",
    "resource-id": "$context.resourceId",
    "http-method": "$context.httpMethod",
    "source-ip": "$context.identity.sourceIp",
    "user-agent": "$context.identity.userAgent",
    "account-id": "$context.identity.accountId",
    "api-key": "$context.identity.apiKey",
    "caller": "$context.identity.caller",
    "user": "$context.identity.user",
    "user-arn": "$context.identity.userArn",
    "queryString": "$input.params().querystring",
    "headers": "$input.params().header",
    "pathParams": "$input.params().path",
    "allParams": "$input.params()"
}
```

