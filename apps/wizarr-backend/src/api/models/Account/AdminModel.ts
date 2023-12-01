import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, CreateDateColumn, BeforeInsert, BeforeUpdate, OneToMany, JoinTable } from "typeorm";
import { Role } from "./RoleModel";
import { hashPassword } from "../../../utils/password.helper";
import { EntityBase } from "../BaseModel";
import { Session } from "./SessionsModel";
import { DateTimeNow } from "../../../data-source";

import type { Admin as IAdmin } from "@wizarrrr/wizarr-sdk";

@Entity("admins")
export class Admin extends EntityBase {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text", { nullable: false })
    name: string;

    @Column("text", { unique: true, nullable: false })
    username: string;

    @Column("text", { unique: true, nullable: false })
    email: string;

    @Column("text", { nullable: false })
    password: string;

    @ManyToMany(() => Role, null, { eager: true, cascade: true })
    @JoinTable()
    roles: Role[];

    @OneToMany(() => Session, (session) => session.user, { nullable: true, cascade: true })
    sessions: Session[];

    @CreateDateColumn(DateTimeNow())
    createdAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        this.password = await hashPassword(this.password);
    }
}
