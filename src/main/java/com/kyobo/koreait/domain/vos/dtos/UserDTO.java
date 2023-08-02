package com.kyobo.koreait.domain.vos.dtos;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

@Getter
@Setter
public class UserDTO extends User implements OAuth2User {
    private String email;
    private String password;
    private String name;
    private String birth;
    private String phone;
    private Map<String, Object> properties; // 소셜 로그인 정보

    public UserDTO(String username, String password, String name, String birth, String phone,  Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
        this.email = username;
        this.password = password;
        this.name = name;
        this.birth = birth;
        this.phone = phone;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return this.getProperties();
    }

    @Override
    public <A> A getAttribute(String name) {
        return OAuth2User.super.getAttribute(name);
    }

}
