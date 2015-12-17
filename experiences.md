#Mapping template to get params into lambda:#
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

