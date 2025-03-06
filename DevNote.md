#### Termin Datenstruktur

```js
const wunschTermin = [{}];

const terminList = [{}];
```

### MUI DRAWER & DASHBOARD

- https://codesandbox.io/embed/ll9l3s?module=/src/Demo.js&fontsize=12
- https://codesandbox.io/embed/xmcfxl?module=/src/Demo.js&fontsize=12

### Change in Backend:

- Adding to prevent the pop-up login from API via browser.  
  ![alt text](image.png)

```java
.httpBasic()
.and()
.exceptionHandling()
.authenticationEntryPoint((request, response, authException) -> {
response.setContentType("application/json");
response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
response.getWriter().write("{\"error\": \"Unauthorized access\"}");
response.setHeader("WWW-Authenticate", ""); // Removes the browser login popup
})
```

After apply, access directly to API through browser will nomore work.  
![alt text](image-1.png)
