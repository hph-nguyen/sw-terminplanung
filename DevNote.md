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

### Time Hashmap - Idea for SW

1. Save time slot that being taken from other falkultat --> checkCollisionFromExternAppt
2. Check collision from intern
3. Save time slot that being scheduled for same dozent
4. Check for the conflict through hashmap

Obj = {
anfangszeit:
dauer:
gu:
sh:
}

```java
{
  0: [Obj, Obj],
  1: [ Obj, Obj ],
  2: [ Obj ]
}
```

### Problem

1. How to apply conflict check for raubus and other system that have other format from appt.

### TODO

1. Get method with termin from extern
